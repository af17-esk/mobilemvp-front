import React, { useEffect } from "react";
import { nanoid } from "nanoid";

const Generate = () => {

  useEffect(() => {
    document.getElementById("generateRID")?.click();
  }, []);

  const newRID = nanoid();

  return (
    <div>
      <a
        style={{ textDecoration: "none", color: 'white' }}
        href={`/?RID=${newRID}`}
        id="generateRID"
      >
        dxsaxsax
      </a>
    </div>
  );
};

export default Generate;
