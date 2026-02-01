export function getTodayDate(){
    const today = new Date();

    return formatDateToSearch(today);

}

export function formatDateToSearch(date:Date){
    date.setDate(date.getDate()+1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
}

export function formatDateToDisplay(inputDate:string) {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function isDateNotGreaterThanToday(dateString:string) {
    const enteredDate = new Date(dateString);
    enteredDate.setDate(enteredDate.getDate()+1);
    const today = new Date();

    // Set the time components to 00:00:00 to compare dates only
    enteredDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return enteredDate <= today;
}

export function isValidDateV2(dateString:string) {
  // Regular expression to match "yyyy-mm-dd" format
  const regex = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;

  if (!regex.test(dateString)) {
    return false; // Not in the correct format
  }

  const [year, month, day] = dateString.split('-').map(Number);

  // Check if the month is valid
  if (month < 1 || month > 12) {
    return false;
  }

  // Check if the day is valid considering leap years
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  return true;
}

export function formatDateAndTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}