import { Subject } from '../../types';
import { SearchableDropdown } from '../ui';

interface SubjectSelectorProps {
  subjects: Subject[];
  selectedSubject: string;
  onSubjectChange: (subjectId: string) => void;
  onAddSubject: (name: string) => void;
}

export default function SubjectSelector({
  subjects,
  selectedSubject,
  onSubjectChange,
  onAddSubject
}: SubjectSelectorProps) {
  return (
    <SearchableDropdown
      options={subjects}
      value={selectedSubject}
      onChange={onSubjectChange}
      placeholder="Wybierz przedmiot"
      allowAdd={true}
      onAdd={onAddSubject}
      required={true}
    />
  );
}
