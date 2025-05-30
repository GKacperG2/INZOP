import { Professor } from '../../types';
import { SearchableDropdown } from '../ui';

interface ProfessorSelectorProps {
  professors: Professor[];
  selectedProfessor: string;
  onProfessorChange: (professorId: string) => void;
  onAddProfessor: (name: string) => void;
}

export default function ProfessorSelector({
  professors,
  selectedProfessor,
  onProfessorChange,
  onAddProfessor
}: ProfessorSelectorProps) {
  return (
    <SearchableDropdown
      options={professors}
      value={selectedProfessor}
      onChange={onProfessorChange}
      placeholder="Wybierz prowadzącego"
      allowAdd={true}
      onAdd={onAddProfessor}
      required={true}
    />
  );
}
