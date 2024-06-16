const CategoryForm = ({
  handleSubmit,
  defaultValue,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValue?: string;
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label>
        <span className="block text-lg font-medium">Назва категорії</span>
        <input
          type="text"
          name="name"
          required
          placeholder="Назва"
          defaultValue={defaultValue && defaultValue}
        />
      </label>
      <button className="bg-blue-300 p-2 transition-colors hover:bg-blue-500">
        Підтвердити
      </button>
    </form>
  );
};

export default CategoryForm;
