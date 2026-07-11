// Minimal mail config - not used in production
export const sendMail = async (to: string, subject: string, text: string) => {
  console.log(`Mail would be sent to ${to}: ${subject}`);
  return true;
};
