type Props = {
    label: string;
    type: string;
    name: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  
  const InputField = ({ label, type, name, placeholder, value, onChange }: Props) => (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-xl  border-gray-300 focus:border-[#48BD28] focus:outline-none"
        required                    
      />      
    </div>
  );
  
  export default InputField;
  