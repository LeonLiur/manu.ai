import { ChevronRightIcon } from "@radix-ui/react-icons"
 
import { Button } from "@/components/ui/button"

export default function ButtonIcon(){
    return (
        <Button className= "hover: bg-slate-500" variant="default" size="icon">
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
    )
    
}