export default async function BoardPage({
  params,
}: {
  params: { user: string; board: string };
}) {
  const { user, board } = params;

  return (
    <div>
      <h1>user: {user}</h1>
      <h1>board page: {board}</h1>
    </div>
  );
}
