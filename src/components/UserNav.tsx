import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  email: string;
  firstname: string;
  lastname: string;
}

function UserNav() {
  const { logout } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [firstname, setFirstname] = useState<string | null>(null);
  const [lastname, setLastname] = useState<string | null>(null);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setEmail(decodedToken.email);
        setFirstname(decodedToken.firstname);
        setLastname(decodedToken.lastname);
      } catch (error) {
        console.error('Failed to decode token:', error);
        // Optionally, handle token decode error (e.g., clear token, log out user)
        handleLogout();
      }
    }
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src="https://pbs.twimg.com/media/FjU2lkcWYAgNG6d.jpg"
              alt="avatar"
            />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{firstname} {lastname}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <button onClick={handleLogout}><DropdownMenuItem>Log out</DropdownMenuItem></button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default UserNav;
