import Header from "@/components/Header/Header";
import { hygraph } from "@/lib/hygraph";
import {CONTACT_PAGE_QUERY,type ContactPageQueryResult} from "@/lib/queries/contact";


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
      <main style={{ marginTop: "50vH",transform:'translateY(-50%)',marginInline:'auto', padding: "0 20px", textAlign:'center', width:'60vW' }}>
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
