import { useState, useEffect, useRef } from "react";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { OverlayPanel } from "primereact/overlaypanel";
import "primeicons/primeicons.css";

interface Product {
  title?: string;
  place_of_origin?: string;
  artist_display?: string;
  inscriptions?: string;
  date_start?: string;
  date_end?: number;
}

export default function CheckboxRowSelectionDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [userInput, setUserInput] = useState(0);
  const op = useRef<OverlayPanel>(null);

  useEffect(() => {
    axios
      .get("https://api.artic.edu/api/v1/artworks?page=1")
      .then((response) => {
        const cleaned = response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          place_of_origin: item.place_of_origin,
          artist_display: item.artist_display,
          inscriptions: item.inscriptions,
          date_start: item.date_start,
          date_end: item.date_end,
        }));
        setProducts(cleaned);
      });

  }, []);

  const onPageChange = (e: DataTablePageEvent) => {
    setFirst(e.first);
    setRows(e.rows);
    console.log("Current Page:", e.page ?? 0 + 1);

    axios
      .get(`https://api.artic.edu/api/v1/artworks?page=${(e.page??0) + 1}`)
      .then((response) => {
        const newProducts = response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          place_of_origin: item.place_of_origin,
          artist_display: item.artist_display,
          inscriptions: item.inscriptions,
          date_start: item.date_start,
          date_end: item.date_end,
        }));
        setProducts(newProducts);

        const alreadySelectedCount = selectedProducts.length;
        const remainingToSelect = userInput - alreadySelectedCount;

        if (remainingToSelect > 0) {
          const rowsToAdd = newProducts.slice(0, remainingToSelect);

          setSelectedProducts([...selectedProducts, ...rowsToAdd]);
        }
      });
  };

  const customRowSelect = () => {
    let num = Number(userInput);
    setSelectedProducts(products.slice(0, num));
  };

  return (
    <div className="card">
     

      <DataTable
        paginator
        lazy
        first={first}
        rows={rows}
        totalRecords={120}
        onPage={onPageChange}
        value={products}
        selectionMode={"checkbox"}
        selection={selectedProducts}
        onSelectionChange={(e) => {
          setSelectedProducts(e.value);
          console.log(e);
          console.log(e.value);
        }}
        dataKey="id"
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="title"
          header={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: "8px",
              }}
            >
              <i
                className="pi pi-chevron-down"
                style={{ cursor: "pointer" }}
                onClick={(e) => op.current?.toggle(e)}
              />
              <span>Title</span>
              <OverlayPanel ref={op}>
                <p>Enter NUMBER OF ROWS TO SELECT</p>
                <input
                  onChange={(e) => setUserInput(Number(e.target.value))}
                  type="number"
                />
                <button onClick={customRowSelect}>Submit</button>
              </OverlayPanel>
            </div>
          }
        ></Column>
        <Column field="place_of_origin" header="Place of origin"></Column>
        <Column field="artist_display" header="artist display"></Column>
        <Column field="inscriptions" header="inscriptions"></Column>
        <Column field="date_start" header="date start"></Column>
        <Column field="date_end" header="date end"></Column>
      </DataTable>
    </div>
  );
}
