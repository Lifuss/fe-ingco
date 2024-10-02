import TextPlaceholder from '@/app/ui/TextPlaceholder';
import { getProductClicksThunk } from '@/lib/appState/dashboard/statsOperations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, LabelList } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CategoryPieChart = ({
  dateRange,
}: {
  dateRange: [Date | undefined, Date | undefined];
}) => {
  const dispatch = useAppDispatch();
  const clicksData = useAppSelector(
    (state) => state.dashboardSlice.stats.productClicks,
  );
  useEffect(() => {
    dispatch(
      getProductClicksThunk({
        page: 1,
        limit: 10,
        startDate: dateRange[0],
        endDate: dateRange[1],
      }),
    );
  }, [dispatch, dateRange]);

  return (
    <div className="w-[400px] rounded-lg border border-gray-200 p-1">
      <h2 className="text-center text-xl font-medium">
        Динаміка клілків на товар
      </h2>
      {clicksData.length ? (
        <PieChart width={400} height={400} className="mx-auto">
          <Pie
            data={clicksData}
            dataKey="clicks"
            nameKey="productId.name"
            cx="50%"
            cy="50%"
            outerRadius={150}
          >
            <LabelList
              dataKey="clicks"
              className="text-lg font-normal"
              position="inside"
            />
            {clicksData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      ) : (
        <TextPlaceholder text="Немає данних" title="Помилка" />
      )}
    </div>
  );
};

export default CategoryPieChart;
