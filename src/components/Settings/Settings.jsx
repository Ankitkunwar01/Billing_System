import React, { useState } from "react";
import Card from "../common/Card";
import Input from "../common/Input";
import Select from "../common/Select";

function Settings({ defaultTax, setDefaultTax }) {
  const [name, setName] = useState("Sunrise Cafe");
  const [addr, setAddr] = useState("123 Main St");
  const [phone, setPhone] = useState("(555) 010-1234");

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-6" title="Business Profile">
        <div className="grid gap-2">
          <Input label="Business Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <Input label="Address" value={addr} onChange={(e)=>setAddr(e.target.value)} />
          <Input label="Phone" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        </div>
      </Card>
      <Card className="col-span-6" title="Defaults">
        <div className="grid gap-2">
          <Input label="Default Tax %" type="number" value={defaultTax} onChange={(e)=>setDefaultTax(Number(e.target.value))} />
          <div className="text-xs text-gray-600">This rate pre-fills on new orders (editable per order).</div>
        </div>
      </Card>
      <Card className="col-span-12" title="Printers & Receipts">
        <div className="grid grid-cols-3 gap-3">
          <Select label="Printer">
            <option>Default System Printer</option>
            <option>Thermal 80mm</option>
            <option>PDF</option>
          </Select>
          <Select label="Paper Size">
            <option>80mm</option>
            <option>58mm</option>
            <option>A4</option>
          </Select>
          <Select label="Receipt Copy Count">
            <option>1</option>
            <option>2</option>
            <option>3</option>
          </Select>
        </div>
      </Card>
    </div>
  );
}

export default Settings;