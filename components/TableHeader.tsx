import React from "react";

interface Props {
  columns: string[];
}

const TableHeader = ({ columns }: Props) => {
  return (
    <thead className="bg-gray-100">
      <tr>
        {columns.map((col) => (
          <th
            key={col}
            className="px-4 py-2 text-left text-secondary-mid font-medium uppercase"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
