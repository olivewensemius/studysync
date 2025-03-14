'use client'

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
//Maybe have to adjust this page to be the page people will be redirected to right AFTER pressing signup button
//We want the user to know that after they sign up, they need to confirm their email








// export default function ConfirmEmailPage({
//   searchParams,
// }: {
//   searchParams: { token_hash: string; type: string };
// }) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-neutral-50 p-4">
//       <Card className="max-w-md w-full p-8 text-center">
//         <div className="bg-primary-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
//           <CheckCircle2 className="w-8 h-8 text-primary-600" />
//         </div>
        
//         <h1 className="text-2xl font-bold text-neutral-800 mb-4">
//           Confirm Your Email
//         </h1>
        
//         <p className="text-neutral-600 mb-8">
//           Please click the button below to confirm your email address and complete your registration.
//         </p>
        
//         <Button
//           className="w-full bg-primary-500 hover:bg-primary-600 text-white"
//           onClick={() => {
//             // Handle confirmation logic here
//             window.location.href = `/auth/confirm?token_hash=${searchParams.token_hash}&type=${searchParams.type}`;
//           }}
//         >
//           Confirm Email Address
//         </Button>
        
//         <p className="mt-6 text-sm text-neutral-500">
//           If you didn't create an account with StudySync, you can safely ignore this email.
//         </p>
//       </Card>
//     </div>
//   );
// } 