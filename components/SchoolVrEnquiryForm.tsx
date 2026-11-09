"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  GraduationCap,
  Loader2,
  Sparkles,
  School,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CyberButton } from "@/components/ui/cyber-button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type EnquiryMode = "demo" | "custom"

const SUBJECT_OPTIONS = [
  "Space & Astronomy",
  "Human Biology & Life Sciences",
  "Natural Sciences & Physics",
  "Geography & Earth Sciences",
  "History & Heritage",
  "Engineering & Technology",
  "Mathematics & Spatial Learning",
]

interface SchoolVrEnquiryFormProps {
  defaultMode?: EnquiryMode
}

export default function SchoolVrEnquiryForm({ defaultMode = "demo" }: SchoolVrEnquiryFormProps) {
  const [mode, setMode] = useState<EnquiryMode>(defaultMode)
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [prefilledTopic, setPrefilledTopic] = useState("")
  const [prefilledSubject, setPrefilledSubject] = useState("")

  // Listen to custom window events or hash changes so page CTAs can toggle mode directly
  useEffect(() => {
    const handleHashOrEvent = () => {
      if (window.location.hash === "#propose-custom-vr") {
        setMode("custom")
      } else if (window.location.hash === "#book-school-demo") {
        setMode("demo")
      }
    }

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: EnquiryMode; topic?: string; subject?: string }>
      if (customEvent.detail?.mode) {
        setMode(customEvent.detail.mode)
        setStatus("idle")
      }
      if (customEvent.detail?.topic !== undefined) {
        setPrefilledTopic(customEvent.detail.topic)
      }
      if (customEvent.detail?.subject !== undefined) {
        setPrefilledSubject(customEvent.detail.subject)
        if (customEvent.detail.mode === "demo" && customEvent.detail.subject) {
          setSelectedSubjects((prev) =>
            prev.includes(customEvent.detail.subject!) ? prev : [...prev, customEvent.detail.subject!]
          )
        }
      }
    }

    handleHashOrEvent()
    window.addEventListener("hashchange", handleHashOrEvent)
    window.addEventListener("select-school-enquiry-mode", handleCustomEvent)
    return () => {
      window.removeEventListener("hashchange", handleHashOrEvent)
      window.removeEventListener("select-school-enquiry-mode", handleCustomEvent)
    }
  }, [])

  function toggleSubject(subject: string) {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("sending")
    setErrorMsg("")

    const fd = new FormData(e.currentTarget)
    const schoolName = (fd.get("school_name") as string)?.trim() || ""
    const contactPerson = (fd.get("contact_person") as string)?.trim() || ""
    const role = (fd.get("contact_role") as string)?.trim() || ""
    const email = (fd.get("email") as string)?.trim() || ""
    const phone = (fd.get("phone") as string)?.trim() || ""
    const suburb = (fd.get("suburb") as string)?.trim() || ""

    const combinedName = role
      ? `${contactPerson} (${role} - ${schoolName})`
      : `${contactPerson} (${schoolName})`

    let compiledMessage = ""
    let eventDate: string | undefined = undefined
    let eventTime: string | undefined = undefined

    if (mode === "demo") {
      const learnerCount = (fd.get("learner_count") as string)?.trim() || "Not specified"
      const grades = (fd.get("grades") as string)?.trim() || "Not specified"
      const sessionFormat = (fd.get("session_format") as string)?.trim() || "School Demonstration"
      const rawDate = (fd.get("event_date") as string)?.trim() || ""
      const rawTime = (fd.get("event_time") as string)?.trim() || ""
      const notes = (fd.get("message") as string)?.trim() || ""

      if (rawDate) eventDate = rawDate
      if (rawTime) eventTime = rawTime

      const subjectsStr =
        selectedSubjects.length > 0 ? selectedSubjects.join(", ") : "Open to recommendations"

      compiledMessage = [
        `=== SCHOOL VR DEMONSTRATION ENQUIRY ===`,
        `School Name: ${schoolName}`,
        `Contact Person: ${contactPerson}${role ? ` (${role})` : ""}`,
        `School Location: ${suburb}`,
        `Preferred Format: ${sessionFormat}`,
        `Target Grade(s): ${grades}`,
        `Estimated Number of Learners: ${learnerCount}`,
        `Subjects / Experiences of Interest: ${subjectsStr}`,
        notes ? `\nAdditional Details & Learning Objectives:\n${notes}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    } else {
      const subjectArea = (fd.get("subject_area") as string)?.trim() || ""
      const grades = (fd.get("grades") as string)?.trim() || "Not specified"
      const curriculum = (fd.get("curriculum") as string)?.trim() || "CAPS"
      const topicConcept = (fd.get("topic_concept") as string)?.trim() || ""
      const learnerExperience = (fd.get("learner_experience") as string)?.trim() || ""
      const whyVr = (fd.get("why_vr") as string)?.trim() || ""
      const audienceCount = (fd.get("audience_count") as string)?.trim() || "Not specified"
      const timeframe = (fd.get("timeframe") as string)?.trim() || "Flexible / Open to discussion"

      compiledMessage = [
        `=== CUSTOM EDUCATIONAL VR DEVELOPMENT ENQUIRY ===`,
        `School / Institution: ${schoolName}`,
        `Contact Person: ${contactPerson}${role ? ` (${role})` : ""}`,
        `Location: ${suburb}`,
        `Curriculum Framework: ${curriculum}`,
        `Subject / Learning Area: ${subjectArea}`,
        `Target Grade(s): ${grades}`,
        `Proposed Topic or Concept: ${topicConcept}`,
        `Expected Learner Audience: ${audienceCount}`,
        `Desired Timeframe: ${timeframe}`,
        `\nWhat Learners Should Experience:\n${learnerExperience}`,
        whyVr ? `\nWhy VR Could Help & Specific Curriculum Requirements:\n${whyVr}` : "",
      ]
        .filter(Boolean)
        .join("\n")
    }

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: combinedName,
          email,
          phone: phone || undefined,
          suburb,
          event_date: eventDate,
          event_time: eventTime,
          form_type: mode === "demo" ? "school" : "custom_vr_development",
          message: compiledMessage,
        }),
      })

      if (res.ok) {
        setStatus("success")
        setSelectedSubjects([])
        setPrefilledTopic("")
        setPrefilledSubject("")
        ;(e.target as HTMLFormElement).reset()
      } else {
        const d = await res.json().catch(() => ({}))
        setErrorMsg(d.error ?? "We could not submit your enquiry right now. Please try again.")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Network error while submitting your enquiry. Please check your connection and try again.")
      setStatus("error")
    }
  }

  return (
    <div className="bg-card/90 backdrop-blur-md rounded-2xl border border-border shadow-2xl overflow-hidden">
      {/* Mode Switcher Tabs */}
      <div
        role="tablist"
        aria-label="School VR Enquiry Type"
        className="grid grid-cols-1 sm:grid-cols-2 border-b border-border bg-secondary/40"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "demo"}
          onClick={() => {
            setMode("demo")
            setStatus("idle")
            setErrorMsg("")
          }}
          className={`flex items-start gap-3.5 p-5 text-left transition-all cursor-pointer border-b-2 sm:border-b-0 sm:border-r border-border/60 ${
            mode === "demo"
              ? "bg-primary/10 border-b-2 !border-b-primary text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <div
            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              mode === "demo"
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <School className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base flex items-center gap-2">
              1. School Demonstration Enquiry
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Bring our existing educational VR experiences & supervised mobile setups to your school.
            </p>
          </div>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === "custom"}
          onClick={() => {
            setMode("custom")
            setStatus("idle")
            setErrorMsg("")
          }}
          className={`flex items-start gap-3.5 p-5 text-left transition-all cursor-pointer ${
            mode === "custom"
              ? "bg-primary/10 border-b-2 !border-b-primary text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <div
            className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
              mode === "custom"
                ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                : "bg-secondary text-muted-foreground"
            }`}
          >
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base flex items-center gap-2">
              2. Custom VR Development Enquiry
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Propose a curriculum topic or learning challenge for our VR development team to evaluate.
            </p>
          </div>
        </button>
      </div>

      {/* Form Body */}
      <div className="p-6 sm:p-8 lg:p-10">
        {status === "success" ? (
          <div className="py-10 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              {mode === "demo"
                ? "School Demonstration Enquiry Received"
                : "Custom VR Concept Submitted for Evaluation"}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {mode === "demo"
                ? "Thank you for contacting Virtual Reality Guys. Our education coordination team will review your school's requirements, grade levels, and preferred dates and respond within 24 hours."
                : "Thank you for sharing your educational VR concept. Our development team will evaluate the topic's curriculum relevance, pedagogical value, and technical requirements before contacting you to discuss the next steps."}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Button variant="outline" onClick={() => setStatus("idle")}>
                Submit Another Enquiry
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Context Banner */}
            <div className="rounded-xl bg-secondary/50 border border-border/80 p-4 flex items-start gap-3">
              {mode === "demo" ? (
                <>
                  <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Requesting an On-Site School VR Session:</strong>{" "}
                    Tell us about your learners, grades, and subjects of interest. We handle full equipment delivery, classroom or hall setup, facilitator supervision, and hygiene rotations.
                  </div>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Proposing a New Educational VR Experience:</strong>{" "}
                    Share a topic or concept that is difficult to teach through textbooks alone. Every proposal is evaluated for curriculum relevance, educational impact, and technical feasibility before a development decision and separate quotation are prepared.
                  </div>
                </>
              )}
            </div>

            {/* Shared School & Contact Fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="school_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  School / Institution Name *
                </label>
                <Input
                  id="school_name"
                  name="school_name"
                  placeholder="e.g. Westerford High School / Reddam House"
                  className="bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="suburb" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  School Location (Suburb / City / Province) *
                </label>
                <Input
                  id="suburb"
                  name="suburb"
                  placeholder="e.g. Rondebosch, Cape Town / Stellenbosch / Gauteng"
                  className="bg-background"
                  required
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="contact_person" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Person *
                </label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  placeholder="Full name"
                  className="bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="contact_role" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Role at School <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                </label>
                <Input
                  id="contact_role"
                  name="contact_role"
                  placeholder="e.g. Principal, HOD Natural Sciences, Teacher"
                  className="bg-background"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="school_email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Address *
                </label>
                <Input
                  id="school_email"
                  name="email"
                  type="email"
                  placeholder="teacher@school.co.za"
                  className="bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="school_phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Phone / WhatsApp Number
                </label>
                <Input
                  id="school_phone"
                  name="phone"
                  type="tel"
                  placeholder="+27 71 000 0000"
                  className="bg-background"
                />
              </div>
            </div>

            {/* Mode-Specific Fields */}
            {mode === "demo" ? (
              <>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="grades" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Grade(s)
                    </label>
                    <Input
                      id="grades"
                      name="grades"
                      placeholder="e.g. Grade 6–7 or Grade 10–12"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="learner_count" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Estimated Number of Learners
                    </label>
                    <Input
                      id="learner_count"
                      name="learner_count"
                      placeholder="e.g. 35 learners (1 class) or 120"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="session_format" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Session Type
                    </label>
                    <select
                      id="session_format"
                      name="session_format"
                      defaultValue="Classroom / Subject Demonstration"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="Classroom / Subject Demonstration">Classroom / Subject Demonstration</option>
                      <option value="Introductory Teacher & HOD Demo">Introductory Teacher & HOD Demo</option>
                      <option value="STEM / Science & Technology Day">STEM / Science & Technology Day</option>
                      <option value="Full-Grade Immersive Learning Day">Full-Grade Immersive Learning Day</option>
                      <option value="School Exhibition / Open Day">School Exhibition / Open Day</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="demo_event_date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Preferred Date <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                    </label>
                    <Input
                      id="demo_event_date"
                      name="event_date"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="bg-background text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="demo_event_time" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Preferred Start Time <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                    </label>
                    <Input
                      id="demo_event_time"
                      name="event_time"
                      type="time"
                      defaultValue="09:00"
                      className="bg-background text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
                    Subjects or Experiences of Interest <span className="text-muted-foreground/60 font-normal">(Select any that apply)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((subj) => {
                      const active = selectedSubjects.includes(subj)
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => toggleSubject(subj)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            active
                              ? "bg-primary/20 border-primary text-primary font-semibold"
                              : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                          }`}
                        >
                          {active ? "✓ " : "+ "}
                          {subj}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="demo_message" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Curriculum Topic or Additional Notes <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                  </label>
                  <Textarea
                    id="demo_message"
                    name="message"
                    rows={3}
                    placeholder="Tell us what topics your classes are currently covering, preferred dates, or any questions about space and setup..."
                    className="bg-background"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="subject_area" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Subject or Learning Area *
                    </label>
                    <Input
                      id="subject_area"
                      name="subject_area"
                      value={prefilledSubject}
                      onChange={(e) => setPrefilledSubject(e.target.value)}
                      placeholder="e.g. Life Sciences, Natural Sciences, History"
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="custom_grades" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Target Grade(s) *
                    </label>
                    <Input
                      id="custom_grades"
                      name="grades"
                      placeholder="e.g. Grade 9 or FET Phase (Grades 10–12)"
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="curriculum" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Curriculum Framework
                    </label>
                    <select
                      id="curriculum"
                      name="curriculum"
                      defaultValue="CAPS (South African National Curriculum)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="CAPS (South African National Curriculum)">CAPS (National Curriculum)</option>
                      <option value="IEB (Independent Examinations Board)">IEB</option>
                      <option value="Cambridge / International Curriculum">Cambridge / International</option>
                      <option value="Other / Multiple Curricula">Other / Multiple Curricula</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="topic_concept" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Proposed Topic or Educational Concept *
                  </label>
                  <Input
                    id="topic_concept"
                    name="topic_concept"
                    value={prefilledTopic}
                    onChange={(e) => setPrefilledTopic(e.target.value)}
                    placeholder="e.g. Human Circulatory System, Mapungubwe Heritage Site, Water Treatment Plant, Electric Circuits"
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="learner_experience" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    What Would You Like Learners to Experience in VR? *
                  </label>
                  <Textarea
                    id="learner_experience"
                    name="learner_experience"
                    rows={3}
                    placeholder="Describe what learners should see, explore, or interact with inside the virtual environment..."
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="why_vr" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Why Do You Believe VR Would Help & Specific Curriculum Objectives? <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                  </label>
                  <Textarea
                    id="why_vr"
                    name="why_vr"
                    rows={2}
                    placeholder="e.g. Learners struggle to visualise 3D valve structures from 2D diagrams, or visiting an industrial plant in person is not practical..."
                    className="bg-background"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="audience_count" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Expected Learner Audience <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                    </label>
                    <Input
                      id="audience_count"
                      name="audience_count"
                      placeholder="e.g. 120 Grade 9 learners per year"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="timeframe" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Desired Timeframe <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                    </label>
                    <Input
                      id="timeframe"
                      name="timeframe"
                      placeholder="e.g. Term 3 2027 / Exploring for future curriculum planning"
                      className="bg-background"
                    />
                  </div>
                </div>
              </>
            )}

            {status === "error" && (
              <div className="p-3.5 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
                {errorMsg}
              </div>
            )}

            <div className="pt-2">
              <CyberButton type="submit" size="full" disabled={status === "sending"}>
                {status === "sending" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    <span>Submitting Enquiry…</span>
                  </>
                ) : mode === "demo" ? (
                  <>
                    <span>Request a School Demonstration</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    <span>Submit Custom VR Concept for Evaluation</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </CyberButton>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
