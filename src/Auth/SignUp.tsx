import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Zod schema for form validation
const schema = z.object({
  name: z.string().min(1, "Full name is required").max(50, "Full name can't exceed 50 characters"),
  email: z.string().email("Please enter a valid email address")
});

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Use zod for form validation
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log(data);
    // Submit data to API or handle form submission logic
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4">
      <h2 className="text-xl mb-2 text-gray-400">GreenKiddo | E-learning Magic</h2>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">
        Join the waitlist for the <br /> <span className="text-green-500">GreenKiddo Beta Platform</span>
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Full name..."
            {...register('name')}
            className={`text-center w-full bg-transparent border-b-2 ${
              errors.name ? 'border-red-500' : 'border-gray-600'
            } text-white placeholder-gray-500 focus:outline-none focus:border-green-500 py-2 px-3`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="relative">
          <input
            type="email"
            placeholder="Address email..."
            {...register('email')}
            className={`text-center w-full bg-transparent border-b-2 ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            } text-white placeholder-gray-500 focus:outline-none focus:border-green-500 py-2 px-3`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-green-900 py-3 px-4 rounded-full shadow-lg font-bold mt-4 hover:bg-green-600 transition duration-300"
        >
          Join the waitlist
        </button>
      </form>

      <div className="mt-8 flex space-x-6 text-gray-400">
        <a href="#" className="hover:text-green-500">Twitter @greenkiddo</a>
        <a href="#" className="hover:text-green-500">Medium @greenkiddo</a>
      </div>
    </div>
  );
};

export default SignUp;
