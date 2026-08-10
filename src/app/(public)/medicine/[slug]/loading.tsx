export default function MedicineLoading() {
  return (
    <div className="py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 shadow-sm animate-pulse">
        <div className="bg-slate-100 rounded-xl min-h-[400px]" />
        <div className="flex flex-col gap-4">
          <div className="h-4 w-24 bg-slate-100 rounded" />
          <div className="h-9 w-3/4 bg-slate-100 rounded" />
          <div className="h-5 w-32 bg-slate-100 rounded" />
          <div className="h-16 w-full bg-slate-100 rounded" />
          <div className="h-px bg-slate-100" />
          <div className="h-10 w-40 bg-slate-100 rounded" />
          <div className="h-24 w-full bg-slate-100 rounded-xl" />
          <div className="h-12 w-full bg-slate-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
