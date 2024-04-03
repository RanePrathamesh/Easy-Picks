
import { connectToDB } from "@/utils/db";


export const GET = async (req, { params }) => {
    await connectToDB();
  
    try {
      if (params.id) {
        const user = await User.findById(params.id);
  
        if (!user) {
          return new Response(`User not found`, { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });
      }
  
      return new Response(`User not found`, { status: 404 });
    } catch (error) {
      return new Response(`Failed to fetch user: ${error}`, { status: 500 });
    }
  };

  export const PUT = async (req, { params}) => {
    await connectToDB();
  const { name, role, status } = await req.json();

    try {
      if (params.id) {
        const user = await User.findById(params.id);
        if (!user) {
          return new Response(`User not found`, { status: 404 });
        }
        user.name = name; 
        user.role = role;
        user.status = status;

        await user.save();
  
        return new Response(`User updated`, { status: 200 });
      }
      return new Response(`User not found`, { status: 404 });
    } catch (error) {
      return new Response(`Failed to update User: ${error}`, { status: 500 });
    }
  };