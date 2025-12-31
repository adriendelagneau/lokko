import React, { Suspense } from "react";

const page = () => {
  return (
    <div>
          <Suspense fallback={<>...</>}></Suspense>
    </div>
  );
};

export default page;
