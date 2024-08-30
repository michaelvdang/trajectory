import FileUploaderBox from "@/components/FileUpload";
import { Button } from "@/components/ui/button";


export default function Upload() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <FileUploaderBox />
    </div>
  );
}