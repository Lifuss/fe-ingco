'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { reorderCategoryThunk } from '@/lib/appState/main/operations';
import { Category } from '@/lib/types';
import { GripVertical } from 'lucide-react';
import { toast } from 'react-toastify';

interface CategoryNode extends Category {
  children: CategoryNode[];
}

interface DropLineProps {
  parentId: number | null;
  index: number;
  onMove: (id: number, parentId: number | null, index: number) => void;
  draggingId: number | null;
  draggingPath?: string | null;
}

const DropLine = ({ parentId, index, onMove, draggingId }: DropLineProps) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        if (!draggingId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        if (!draggingId) return;
        e.preventDefault();
        setIsOver(false);
        onMove(draggingId, parentId, index);
      }}
      className={`relative z-10 -my-1 h-2.5 w-full rounded transition-all ${
        isOver && draggingId
          ? 'scale-[1.01] bg-amber-500 shadow shadow-amber-500/50'
          : 'bg-transparent'
      }`}
    />
  );
};

interface NodeProps {
  node: CategoryNode;
  draggingId: number | null;
  draggingPath: string | null;
  onMove: (id: number, parentId: number | null, index: number) => void;
  setDraggingId: (id: number | null) => void;
  setDraggingPath: (path: string | null) => void;
}

const CategoryTreeNode = ({
  node,
  draggingId,
  draggingPath,
  onMove,
  setDraggingId,
  setDraggingPath,
}: NodeProps) => {
  const [isOverSelf, setIsOverSelf] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', String(node.id));
    // Defer state updates to allow browser to initiate drag session cleanly
    setTimeout(() => {
      setDraggingId(node.id);
      setDraggingPath(node.path || null);
    }, 0);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDraggingPath(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggingId && draggingId !== node.id && draggingPath) {
      // Prevent nesting inside itself or its descendants
      const isDescendant = (node.path || '').split('.').includes(String(draggingId));
      if (!isDescendant) {
        e.dataTransfer.dropEffect = 'move';
        setIsOverSelf(true);
      }
    }
  };

  const handleDragLeave = () => {
    setIsOverSelf(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverSelf(false);
    if (draggingId && draggingId !== node.id) {
      const isDescendant = (node.path || '').split('.').includes(String(draggingId));
      if (!isDescendant) {
        onMove(draggingId, node.id, node.children.length);
      }
    }
  };

  const hasChildren = node.children.length > 0;

  return (
    <div className="flex w-full flex-col gap-1 font-sans">
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex w-full items-center gap-3 rounded-xl border p-3.5 transition-all select-none ${
          draggingId === node.id
            ? 'scale-[0.98] border-dashed border-neutral-200 bg-neutral-50 opacity-40'
            : isOverSelf
              ? 'scale-[1.01] border-2 border-dashed border-amber-400 bg-amber-50 shadow-md shadow-amber-100'
              : 'cursor-grab border-neutral-200 bg-white shadow-sm hover:border-neutral-300 hover:shadow-md active:cursor-grabbing'
        }`}
      >
        <GripVertical className="h-4 w-4 shrink-0 text-neutral-400" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-neutral-800">{node.name}</span>
          {node.parentId && (
            <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Підкатегорія
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span
            className={`rounded-md border px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
              node.showInMenu
                ? 'border-green-100 bg-green-50 text-green-600'
                : 'border-orange-100 bg-orange-50 text-orange-600'
            }`}
          >
            {node.showInMenu ? 'У меню' : 'Прихована'}
          </span>
        </div>
      </div>

      {hasChildren && (
        <div className="mt-1.5 ml-5 flex w-full max-w-[calc(100%-20px)] flex-col gap-1 border-l border-neutral-200 pl-6">
          {node.children.map((child, index) => (
            <React.Fragment key={child.id}>
              <DropLine
                parentId={node.id}
                index={index}
                onMove={onMove}
                draggingId={draggingId}
                draggingPath={draggingPath}
              />
              <CategoryTreeNode
                node={child}
                draggingId={draggingId}
                draggingPath={draggingPath}
                onMove={onMove}
                setDraggingId={setDraggingId}
                setDraggingPath={setDraggingPath}
              />
              {index === node.children.length - 1 && (
                <DropLine
                  parentId={node.id}
                  index={index + 1}
                  onMove={onMove}
                  draggingId={draggingId}
                  draggingPath={draggingPath}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

const CategorySortView = () => {
  const dispatch = useAppDispatch();
  const rawCategories = useAppSelector((state) => state.persistedMainReducer.categories);
  const categoriesList = useMemo(() => rawCategories || [], [rawCategories]);

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [draggingPath, setDraggingPath] = useState<string | null>(null);

  const categoryTree = useMemo(() => {
    const map = new Map<number, CategoryNode>();
    categoriesList.forEach((c) => {
      map.set(c.id, { ...c, children: [] });
    });

    const roots: CategoryNode[] = [];
    categoriesList.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) {
          parent.children.push(node);
        } else {
          roots.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    const sortNodes = (nodes: CategoryNode[]) => {
      nodes.sort((a, b) => a.renderSort - b.renderSort);
      nodes.forEach((n) => sortNodes(n.children));
    };
    sortNodes(roots);

    return roots;
  }, [categoriesList]);

  const handleMove = useCallback(
    (id: number, parentId: number | null, targetIndex: number) => {
      const category = categoriesList.find((c) => c.id === id);
      if (!category) return;

      const currentSiblings = categoriesList
        .filter((c) => c.parentId === category.parentId)
        .sort((a, b) => a.renderSort - b.renderSort);
      const currentIndex = currentSiblings.findIndex((c) => c.id === id);

      if (category.parentId === parentId) {
        if (targetIndex === currentIndex || targetIndex === currentIndex + 1) {
          // Ignore move to the same position
          return;
        }
      }

      dispatch(reorderCategoryThunk({ id, parentId, targetIndex }))
        .unwrap()
        .then(() => {
          toast.success('Порядок категорій успішно змінено');
        })
        .catch((err) => {
          toast.error(err || 'Не вдалося змінити порядок');
          console.error('Reorder error:', err);
        });
    },
    [dispatch, categoriesList],
  );

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-6 font-sans">
      <div className="mb-4">
        <h3 className="mb-1 text-sm font-bold tracking-wider text-neutral-800 uppercase">
          Візуальне сортування категорій
        </h3>
        <p className="text-xs text-neutral-500">
          Перетягуйте категорії за картку або значок меню. Перетягніть картку прямо на іншу
          категорію, щоб зробити її підкатегорією. Перетягуйте на помаранчеві смуги між категоріями,
          щоб вставити їх у конкретну позицію.
        </p>
      </div>

      <div className="flex w-full flex-col gap-1">
        {categoryTree.map((root, index) => (
          <React.Fragment key={root.id}>
            <DropLine
              parentId={null}
              index={index}
              onMove={handleMove}
              draggingId={draggingId}
              draggingPath={draggingPath}
            />
            <CategoryTreeNode
              node={root}
              draggingId={draggingId}
              draggingPath={draggingPath}
              onMove={handleMove}
              setDraggingId={setDraggingId}
              setDraggingPath={setDraggingPath}
            />
            {index === categoryTree.length - 1 && (
              <DropLine
                parentId={null}
                index={index + 1}
                onMove={handleMove}
                draggingId={draggingId}
                draggingPath={draggingPath}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CategorySortView;
