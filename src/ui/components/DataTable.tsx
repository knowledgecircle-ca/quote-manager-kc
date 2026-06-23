import type { ReactNode } from "react";

interface DataTableProps {
  caption: string;
  columns: string[];
  children: ReactNode;
}

export function DataTable({ caption, children, columns }: DataTableProps) {
  return (
    <div className="table-scroll">
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
