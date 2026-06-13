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
      className={`h-2.5 -my-1 transition-all rounded w-full z-10 relative ${
        isOver && draggingId ? 'bg-amber-500 shadow shadow-amber-500/50 scale-[1.01]' : 'bg-transparent'
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
    <div className="flex flex-col gap-1 w-full font-sans">
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all select-none w-full ${
          draggingId === node.id
            ? 'opacity-40 bg-neutral-50 border-neutral-200 border-dashed scale-[0.98]'
            : isOverSelf
            ? 'bg-amber-50 border-amber-400 border-2 border-dashed scale-[1.01] shadow-md shadow-amber-100'
            : 'bg-white border-neutral-200 shadow-sm hover:border-neutral-300 hover:shadow-md cursor-grab active:cursor-grabbing'
        }`}
      >
        <GripVertical className="text-neutral-400 w-4 h-4 shrink-0" />
        <div className="flex flex-col">
          <span className="font-bold text-neutral-800 text-sm">{node.name}</span>
          {node.parentId && (
            <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mt-0.5">
              Підкатегорія
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              node.showInMenu
                ? 'bg-green-50 text-green-600 border-green-100'
                : 'bg-orange-50 text-orange-600 border-orange-100'
            }`}
          >
            {node.showInMenu ? 'У меню' : 'Прихована'}
          </span>
        </div>
      </div>

      {hasChildren && (
        <div className="pl-6 border-l border-neutral-200 ml-5 mt-1.5 flex flex-col gap-1 w-full max-w-[calc(100%-20px)]">
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
    [dispatch, categoriesList]
  );

  return (
    <div className="flex flex-col gap-2 w-full bg-neutral-50/50 p-6 rounded-2xl border border-neutral-200 font-sans">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-1">
          Візуальне сортування категорій
        </h3>
        <p className="text-xs text-neutral-500">
          Перетягуйте категорії за картку або значок меню.
          Перетягніть картку прямо на іншу категорію, щоб зробити її підкатегорією.
          Перетягуйте на помаранчеві смуги між категоріями, щоб вставити їх у конкретну позицію.
        </p>
      </div>

      <div className="flex flex-col gap-1 w-full">
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
