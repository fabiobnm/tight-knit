import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import { hygraph } from "@/lib/hygraph";
import {CONTACT_PAGE_QUERY,type ContactPageQueryResult} from "@/lib/queries/contact";

export const dynamic='force-static';
export const revalidate= 0;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Tight Knit — London based Creative Visual Researchers, Designers, AI-collaborators, Writers and Editors.",
  alternates: { canonical: "/contact" },
};



async function getContact(): Promise<ContactPageQueryResult["contacts"][number] | null> {
  const data = await hygraph.request<ContactPageQueryResult>(CONTACT_PAGE_QUERY);
  if (!data.contacts || data.contacts.length === 0) return null;
  return data.contacts[0];
}


export default async function Contact() {
      const contact = await getContact();

    
  return (
    <div >
        <Header />
      <h1 style={{ display: 'none' }}>Tight-knit Contact</h1>
      <main className="textContact opacityAnim">
        <p style={{marginBottom:'50px'}}>CONTACTS</p>


        <div
            style={{
              textAlign: "center", 
            }}
            dangerouslySetInnerHTML={{ __html: contact?.contacts?.html ?? "Nessun contenuto AboutUs trovato." }}
          />

<br /><br /><br /><br /><br /><br />
<div
            style={{
              textAlign: "center",
              
            }}
            dangerouslySetInnerHTML={{ __html: contact?.text?.html ?? "Nessun contenuto AboutUs trovato." }}


            
          />
      </main>
    </div>
  );
}
