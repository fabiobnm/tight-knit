// src/app/about/page.tsx
import Header from "@/components/Header/Header";
import { hygraph } from "@/lib/hygraph";
import {ABOUT_PAGE_QUERY,type AboutPageQueryResult} from "@/lib/queries/about";
import ReactMarkdown from "react-markdown";


async function getAbout(): Promise<AboutPageQueryResult["abouts"][number] | null> {
  const data = await hygraph.request<AboutPageQueryResult>(ABOUT_PAGE_QUERY);
  if (!data.abouts || data.abouts.length === 0) return null;
  return data.abouts[0];
}

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div>
      <Header />
      <main style={{ marginTop: "50vH",transform:'translateY(-50%)', padding: "0 20px" }}>
        <div  style={{display:'flex'}}>
          <div
            style={{
              maxWidth: "50vW",
              lineHeight: 1.3,
              paddingRight:'50px'
            }}
          >
         <p className="contactTitle"> ABOUT US</p> <br />
          
          <div dangerouslySetInnerHTML={{ __html: about?.aboutUs?.html ?? "Nessun contenuto AboutUs trovato." }}/>
      
           
</div>
            <div >
       

  <div>
   <p className="contactTitle2"> WHAT WE DO</p> <br />
   <div className="servicesText"
    >{about?.services}</div>
    
  </div>
           
          </div>
        </div>
      </main>
    </div>
  );
}
