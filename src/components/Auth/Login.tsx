import React, { useState } from "react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

interface LoginProps {
  onSubmit?: (payload: { username: string; email?: string; password: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ username, email, password });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 md:col-span-6 md:col-start-4" title="Log in">
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">Use your signed up credentials</span>
            <Button type="submit" variant="primary">Log in</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;


