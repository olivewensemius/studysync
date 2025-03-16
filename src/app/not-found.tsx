import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
//return to home if cant find then page route thing 404 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 relative">
  
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary-500/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-accent-500/20 rounded-full blur-[100px] -z-10"></div>
      
      <div className="p-8 rounded-xl bg-card-bg shadow-lg dark-card">
        <h2 className="text-4xl font-bold mb-4 font-display gradient-text text-center">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-8 text-center text-lg">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link href="/">
          <Button 
            variant="glow" 
            size="lg"
            className="w-full"
          >
            <Home className="mr-2 h-5 w-5" />
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}