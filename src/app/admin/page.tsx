import { Suspense } from "react";
import { AdminClient } from "./_components/AdminClient";

function AdminClientWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f4efe9]"><p className="text-[#7d4f2d]">Đang tải admin...</p></div>}>
      <AdminClient />
    </Suspense>
  );
}

export default AdminClientWrapper;
