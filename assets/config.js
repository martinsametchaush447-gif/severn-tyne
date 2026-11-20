/*
  Severn & Tyne site settings. This is the only file that needs editing.

  contact.whatsapp  International number, digits only, no plus or spaces: "447700900123".
                    When set, every WhatsApp button opens a chat with this number.
  contact.phone     As people should dial it: "01905 123456". Shown as a call link.
  contact.email     "hello@example.co.uk". Shown as an email link.
                    Leave all three empty and the page says "Contact details coming soon".

  pricing.show      false hides the Prices block completely.
  caseStudies       Each item: { name, place, url, line }. An empty list hides the block.
*/
export const CONFIG = {
  contact: {
    whatsapp: "",
    phone: "",
    email: "",
  },
  person: { name: "", line: "" },
  pricing: {
    show: true,
    websiteFrom: "£399",
    carePlanFrom: "£99 a month",
    carePlanIncludes: "hosting, your phone number, updates and monthly content",
  },
  caseStudies: [],
};
