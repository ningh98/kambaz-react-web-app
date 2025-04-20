/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaCheckCircle, FaBan } from "react-icons/fa";

interface PublishStatusIconProps {
  published: boolean;
  onClick?: () => void;
}

export default function PublishStatusIcon({ published, onClick }: PublishStatusIconProps) {
  return (
    <span 
      className={`me-2 fs-5 ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
      title={published ? "Published - Click to unpublish" : "Not published - Click to publish"}
    >
      {published ? (
        <FaCheckCircle className="text-success" />
      ) : (
        <FaBan className="text-danger" />
      )}
    </span>
  );
}