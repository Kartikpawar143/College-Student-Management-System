import Link from "next/link";
import { IconArrowLeft, IconArrowRight, IconBook2, IconSchool, IconShieldCheck, IconUserPlus } from "@tabler/icons-react";

const steps = [
    { title: "Contact your campus team", text: "Ask your teacher or campus administrator to set up portal access." },
    { title: "Receive your sign-in details", text: "Your account is created with the correct role and campus information." },
    { title: "Sign in and get started", text: "Use your registered email and password to open your workspace." },
];

export default function SignupPage() {
    return (
        <main className="relative isolate flex min-h-screen items-center overflow-hidden bg-[#07111d] px-5 py-20 text-white selection:bg-cyan-300/30 sm:px-8">
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-0 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-[140px]" />
                <div className="absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-violet-500/10 blur-[150px]" />
            </div>

            <div className="mx-auto w-full max-w-5xl">
                <div className="flex flex-wrap items-center justify-between gap-5">
                    <Link href="/" className="flex items-center gap-3" aria-label="GHRUA home">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-200/10 text-cyan-100"><IconSchool size={23} /></span>
                        <span><span className="block text-sm font-bold tracking-wide">GHRUA</span><span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Campus portal</span></span>
                    </Link>
                    <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white"><IconArrowLeft size={17} /> Back to sign in</Link>
                </div>

                <div className="mt-10 grid overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0d1a29]/80 shadow-2xl shadow-black/25 backdrop-blur-2xl lg:grid-cols-[0.92fr_1.08fr] lg:rounded-[2.2rem]">
                    <section className="relative overflow-hidden border-b border-white/[0.08] p-6 sm:p-9 lg:border-b-0 lg:border-r lg:p-12">
                        <div aria-hidden="true" className="absolute -right-20 top-20 h-56 w-56 rounded-full bg-cyan-300/[0.08] blur-3xl" />
                        <div className="relative">
                            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/[0.08] text-cyan-100"><IconUserPlus size={23} /></span>
                            <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-cyan-200">New to the portal?</p>
                            <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl">Get your campus account set up.</h1>
                            <p className="mt-4 text-sm leading-7 text-slate-400">Portal accounts are provided by your campus team so your profile and access match your role.</p>
                            <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                                <IconShieldCheck size={19} className="mt-0.5 shrink-0 text-cyan-200" />
                                <p className="text-xs leading-5 text-slate-300">Students, teachers, and administrators receive role-specific access to campus tools.</p>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 sm:p-9 lg:p-12">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400"><IconBook2 size={16} className="text-cyan-200" /> Account setup</div>
                        <h2 className="mt-3 text-xl font-semibold tracking-tight">Here’s how to get started</h2>
                        <div className="mt-7 space-y-5">
                            {steps.map((step, index) => (
                                <div key={step.title} className="flex gap-4">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.07] text-xs font-bold text-cyan-100">0{index + 1}</span>
                                    <div><h3 className="text-sm font-semibold text-white">{step.title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{step.text}</p></div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 rounded-2xl border border-white/10 bg-[#07111d]/60 p-5">
                            <p className="text-sm font-semibold">Already have an account?</p>
                            <p className="mt-1 text-xs leading-5 text-slate-400">Sign in with the credentials provided by your campus team.</p>
                            <Link href="/login" className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-5 py-3.5 text-sm font-bold text-[#07111d] transition hover:bg-white">Continue to sign in <IconArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
                        </div>
                    </section>
                </div>
                <p className="mt-5 text-center text-xs text-slate-500">GHRUA · Campus portal access</p>
            </div>
        </main>
    );
}
