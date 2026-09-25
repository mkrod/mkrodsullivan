import { SubmitEvent, useCallback, useEffect, useState } from "react";
import styles from "./css/home.module.css";
import ImageViewer from "@/components/viewable_image";
import { appLogo, clientURL, defaultChunkedData, myServices, siteDescription, siteName, skillSet } from "@/constants/variables/global.vars";
import HomeMyServiceCard from "@/components/cards/home.my.service.card";
import InputField from "@/components/input.field";
import EditableInput from "@/components/input";
import { useGlobalProvider } from "@/constants/provider/global.provider";
import ActivityIndicator from "@/components/activity.indicator";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getProjects } from "@/constants/controllers/project.controller";
import { Project } from "@/constants/types/project.type";
import { ChunkedResponse, Response } from "@/constants/types/global.types";
import ProjectCard from "@/components/cards/project.card";
import { useRouter } from "next/router";
import { sendContactMessage } from "@/constants/controllers/contact.controller";

interface Form {
  service?: string[];
  name?: string;
  email?: string;
  message?: string;
}

interface Props {
  projectsRes?: ChunkedResponse<Project>;
}

export default function Home({ projectsRes = defaultChunkedData }: Props) {

  const { results: projects, hasNext: hasNextProject } = projectsRes;
  const router = useRouter();
  const { setNote } = useGlobalProvider();
  const [mounted, setMounted] = useState<boolean>(false);
  const [yearsOfExperience, setYearsOfExperience] = useState(0);
  const [form, setForm] = useState<Form>({})


  useEffect(() => {
    setMounted(true);
    setYearsOfExperience(new Date().getFullYear() - 2022);
  }, []);

  const [submittingForm, setSubmittingForm] = useState<boolean>(false);

  const handleSubmitForm = useCallback(async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (submittingForm) {
      setNote({
        type: 'warning',
        title: "Please Wait...",
      })
      return;
    }

    if (!form.name || !form.email || (!form.message && !form.service?.length)) {
      setNote({
        type: 'error',
        title: 'Please Fill all form field'
      })
      return;
    }

    setSubmittingForm(true);

    try {

      const response: Response = await sendContactMessage(form);
      if (response.status !== 200) throw Error("message failed!");
      setNote({
        type: "success",
        title: "Success",
        body: `
                Your message has been sent, 
                we'll get back to you via the email you provided! thank you.
              `
      })
      setForm({});

    } catch (err) {
      console.log("Error Submitting Form: ", err);

      const subject = encodeURIComponent(
        `Portfolio Contact — ${form.service || "General Inquiry"}`
      );

      const body = encodeURIComponent(
        `Name: ${form.name || ""}\n` +
        `Email: ${form.email || ""}\n` +
        `Service: ${form.service?.join(", ") || ""}\n\n` +
        `Message:\n${form.message || ""}`
      );

      window.location.href =
        `mailto:contact@mkrodsullivan.com?subject=${subject}&body=${body}`;

      setNote({
        type: "warning",
        title: "Unable to send automatically",
        body: "Your email app has been opened so you can send the message directly.",
      });
    } finally {
      setSubmittingForm(false);
    }
  }, [form])

  return (
    <>
      <Head>
        <title>{`${siteName} | Full Stack Developer`}</title>

        <meta
          name="description"
          content={siteDescription}
        />

        <link
          rel="canonical"
          href={clientURL}
        />

        {/* Open Graph */}
        <meta
          property="og:type"
          content="website"
        />

        <meta
          property="og:title"
          content={`${siteName} | Full Stack Developer`}
        />

        <meta
          property="og:description"
          content={siteDescription}
        />

        <meta
          property="og:url"
          content={clientURL}
        />

        <meta
          property="og:site_name"
          content={siteName}
        />

        <meta
          property="og:image"
          content={`${appLogo}`}
        />

        <meta
          property="og:image:alt"
          content={`${siteName} — Full Stack Developer`}
        />

        {/* Page structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${clientURL}/#person`,
                  name: "Mkrod Sullivan",
                  url: clientURL,
                  image: `${clientURL}/mkrodsullivan.png`,
                  jobTitle: "Full Stack Developer",
                  description: siteDescription,
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Lagos",
                    addressCountry: "NG",
                  },
                  knowsAbout: skillSet.map((skill) => skill.name),
                },
                {
                  "@type": "WebSite",
                  "@id": `${clientURL}/#website`,
                  url: clientURL,
                  name: siteName,
                  description: siteDescription,
                  publisher: {
                    "@id": `${clientURL}/#person`,
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <main className={styles.container}>
        <section className={`${styles.heroSection} patternBg`}>
          <header className={styles.heroTop}>
            <div className={styles.avatarWrapper}>
              <ImageViewer
                images={[{ uri: '/mkrodsullivan.png', alt: "MkRoD" }]}
                activityStyle="typing"
                thumbnailClassName={styles.avatar}
              />
            </div>

            <div className={styles.avatarTextBigWrapper}>
              <h1 className={styles.avatarTextBig}>
                Hello, it's Mkrod Sullivan.
              </h1>

              <p className={styles.avatarTextBig}>
                A Full Stack Developer
              </p>
            </div>
          </header>

          <div className={styles.heroBottom}>
            <div className={styles.avatarTextSmallWrapper}>
              <p className={styles.avatarTextSmall}>
                I've been working as a Javascript/Typescript Developer
                for {yearsOfExperience} years,
              </p>

              <p className={styles.avatarTextSmall}>
                I am Based in Lagos, Nigeria
              </p>
            </div>

            <button
              className={styles.hireMeButton}
              onClick={() => router.push("/#contact")}
            >
              Hire Me
            </button>
          </div>
        </section>


        <section className={`${styles.skillSection} patternBg`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>
              Skill Set
            </span>
          </div>

          <div className={styles.skillsWrapper}>
            {skillSet.map((s, index) => (
              <div
                key={s.name}
                className={styles.skillCard}
                style={{ "--index": index } as React.CSSProperties}
              >
                <div className={styles.skillIcon}>{s.icon}</div>
                <p className={styles.skill}>{s.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.serviceSection} patternBg`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>
              Services
            </span>
          </div>
          <div className={styles.servicesWrapper}>
            {Array.from({ length: Math.ceil(myServices.length / 3) },
              (_, rowIndex) => (
                <div className={styles.serviceRow} key={rowIndex}>
                  {myServices
                    .slice(rowIndex * 3, rowIndex * 3 + 3)
                    .map((s) => (
                      <HomeMyServiceCard
                        key={s.name}
                        data={s}
                      />
                    ))}
                </div>
              )
            )}
          </div>
        </section>



        {projects.length > 0 && (
          <section
            id="projects"
            className={`${styles.projectsSection} patternBg`}
          >
            <div className={styles.sectionHeader}>
              <span className={styles.sectionHeaderLabel}>
                Projects
              </span>
            </div>

            <div className={styles.projectsWrapper}>
              {projects.map((project) => (
                <ProjectCard
                  key={project.project_id}
                  project={project}
                />
              ))}
            </div>

            {hasNextProject && (
              <button
                onClick={() =>
                  router.push("/project")
                }
                className={styles.viewMoreProject}
              >
                View More
              </button>
            )}
          </section>
        )}


        <section
          id="contact"
          className={styles.contactSection}
        >
          <div className={styles.contactFirst}>
            <span className={styles.gotText}>Got a Project?</span>
            <span className={styles.talkText}>Let's Talk!</span>
          </div>

          <div className={styles.contactFormWrapper}>
            <h2 className={styles.contactFormHeader}>I am interested In...</h2>

            <div className={styles.contactServiceWrapper}>
              {myServices.map((s) => {
                const hasService = form.service?.includes(s.name);
                return (
                  <button
                    onClick={() =>
                      setForm((prev) => {
                        let prevService = [...prev.service || []];
                        if (hasService) {
                          prevService = prevService.filter((ps) => ps !== s.name);
                        } else {
                          prevService.push(s.name)
                        }
                        return { ...prev, service: prevService };
                      })
                    }
                    key={s.name}
                    className={`
                  ${styles.contactService} 
                  ${hasService ?
                        styles.contactServiceActive :
                        ""}
                `}
                  >
                    {s.name}
                  </button>
                )
              })}
            </div>

            <form
              onSubmit={handleSubmitForm}
              className={styles.contactForm}
            >
              <InputField
                label="Your Name"
                value={form.name || ""}
                setValue={(name) => setForm((prev) => ({ ...prev, name }))}
                style={{ width: "100%" }}
                labelStyle={{ backgroundColor: "var(--bg)" }}
              />
              <InputField
                label="Your Email Address"
                value={form.email || ""}
                setValue={(email) => setForm((prev) => ({ ...prev, email }))}
                style={{ width: "100%" }}
                labelStyle={{ backgroundColor: "var(--bg)" }}
              />
              {mounted ? (
                <EditableInput
                  value={form.message || ""}
                  onChange={(message) => setForm((prev) => ({ ...prev, message }))}
                  showProceedButton={false}
                  AIdisabled
                  disableFormatting
                  placeholder="Message"
                  style={{ height: '150px' }}
                />
              ) : null}

              <button
                type="submit"
                className={styles.submitForm}
              >
                {submittingForm ? (
                  <ActivityIndicator
                    style="spin"
                    size="small"
                  />
                ) : "Send Message"}

              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let props: Props = {};

  try {

    //no dynamic filter here 
    //if needed do it at /projects
    //and reuse the project card
    const response = await getProjects({ limit: 3, page: 1 });

    if (response.status !== 200) throw Error("Fetch has failed!")
    if (!response.data) throw Error("Fetch returned no data!");

    props.projectsRes = response.data;

  } catch (err) {
    console.log("Home Data failed: ", err);
  }
  return {
    props
  }
}