import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getHours } from 'date-fns';
import { User } from '@/lib/types';
import { useGetUserActivityQuery } from '@/lib/appState/api/dashboardApi';
import TextPlaceholder from '../TextPlaceholder';

interface UserActivityChartProps {
  startDate: Date;
  endDate: Date;
}

const processUserActivityData = (users: User[]) => {
  // Ініціалізуємо масив з 24 годин
  const hoursCount = Array(24).fill(0);

  // Обчислюємо активність користувачів по годинах
  users.forEach((user) => {
    const hour = getHours(new Date(user.updatedAt)); // Отримуємо годину з поля updatedAt
    hoursCount[hour]++;
  });

  // Перетворюємо масив в об'єкти, щоб Recharts міг з ними працювати
  return hoursCount.map((count, hour) => ({
    name: `${hour}:00`,
    users: count,
  }));
};

const UserActivityChart: React.FC<UserActivityChartProps> = ({ endDate, startDate }) => {
  const { data: activityData } = useGetUserActivityQuery({
    page: 1,
    limit: 100,
    endDate,
    startDate,
  });
  const users = activityData?.users || [];
  const data = processUserActivityData(users);

  if (!users.length) {
    return <TextPlaceholder text="" title="Немає даних" />;
  }
  return (
    <div className="rounded-lg border border-gray-200 p-1">
      <h2 className="text-center text-xl font-medium">Активність користувачів</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{
              value: 'Година',
              position: 'insideBottomRight',
              offset: -10,
            }}
          />
          <YAxis
            label={{
              value: 'К-сть користувачів',
              angle: -90,
              position: 'insideLeft',
            }}
          />
          <Tooltip />
          <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;
