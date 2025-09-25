import React, { useState } from "react";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";

interface SignUpProps {
  onSubmit?: (payload: { username: string; name: string; email: string; password: string }) => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ username, name, email, password });
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 md:col-span-6 md:col-start-4" title="Create account">
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex justify-between">
            <span className="text-xs text-gray-600">After sign up you will be redirected to Login</span>
            <Button type="submit" variant="primary">Sign up</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;


