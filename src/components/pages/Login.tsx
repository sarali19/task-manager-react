import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      // console.log(data);
      if (data.token && data.role) {
        login(data.token, data.role);
        navigate(`/${data.role.toLowerCase()}`);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
      <div className="flex flex-row min-h-screen justify-center items-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="m-auto">Sign In to Taskify</CardTitle>
            <CardDescription>Provide your credentials, so you could log in.</CardDescription>
          </CardHeader>
         <form onSubmit={handleSubmit}>
          <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                   id="email" 
                   type="email"
                   placeholder="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input 
                   id="password"
                   type="password"
                   placeholder="mot de passe"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)} 
                   onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}/>
                </div>
              </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="m-auto">Sign In</Button>
          </CardFooter>
         </form>
        </Card>
    </div>
  );
};

export default Login;
