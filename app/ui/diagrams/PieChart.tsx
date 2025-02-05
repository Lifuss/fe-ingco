import TextPlaceholder from '@/app/ui/TextPlaceholder';
import { getProductClicksThunk } from '@/lib/appState/dashboard/statsOperations';
import { COLORS } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LabelList,
  ResponsiveContainer,
} from 'recharts';

type ClickProductData = [
  {
    clickInRange: number;
    productDetails: {
      name: string;
    };
    productId: string;
    _id: string;
  },
];
const ProductClicksPieChart = ({
  startDate,
  endDate,
}: {
  startDate: Date | undefined;
  endDate: Date | undefined;
}) => {
  const dispatch = useAppDispatch();
  const clicksData = useAppSelector(
    (state) => state.dashboardSlice.stats.productClicks,
  ) as ClickProductData;

  useEffect(() => {
    dispatch(
      getProductClicksThunk({
        page: 1,
        limit: 40,
        startDate,
        endDate,
      }),
    );
  }, [dispatch, endDate, startDate]);

  return (
    <div className="rounded-lg border border-gray-200 p-1">
      <h2 className="text-center text-xl font-medium">К-сть кліків на товар</h2>
      {clicksData.length ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart className="mx-auto">
            <Pie
              data={clicksData}
              dataKey="clicksInRange"
              nameKey="productDetails.name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ clicksInRange }) => `${clicksInRange}`}
              labelLine={false}
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
        </ResponsiveContainer>
      ) : (
        <TextPlaceholder
          text="(Відсутність даних або некоректна введена дата)"
          title="Немає даних"
        />
      )}
    </div>
  );
};

export default ProductClicksPieChart;
