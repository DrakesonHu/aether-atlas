import Background from '@/components/Background';

export const metadata = {
    title: 'About | Aether Atlas',
    description: 'Learn about Aether Atlas - a digital journal exploring music through deep analysis and an interactive sonic map using triplet similarity comparisons and cognitive science methodology.',
    openGraph: {
        title: 'About - Aether Atlas',
        description: 'Learn about Aether Atlas - a digital journal exploring music through deep analysis.',
        url: 'https://aetheratlas.com/about',
        siteName: 'Aether Atlas',
        type: 'website',
    },
};

export default function AboutPage() {
    return (
        <>
            <Background isAtlas={false} />
            <div className="min-h-screen pt-32 px-6 max-w-2xl mx-auto animate-fade-in relative z-10">
                <h1 className="text-4xl font-display font-light text-charcoal mb-8 uppercase tracking-widest">About the Aether</h1>
                <div className="prose prose-lg max-w-none font-body text-charcoal leading-relaxed space-y-6">
                    <p>
                        The aether is a medium no one can find for a phenomenon everyone can feel. In All About Lily Chou-Chou, it's the name for what music transmits that language can't capture.
                    </p>
                    <p>
                        Aether Atlas is also a digital journal of my own thoughts and feelings for songs that I enjoy or hold a special place in my heart.
                        In its current state, many reviews will likely be informal and not terribly well thought out or polished.
                        This project started as a google doc titled "Songs/Albums". And I enjoyed writing it, so I figured that I wanted to turn it into something more.
                    </p>

                    <p>
                        You may have noticed that this website doesn't look like your typical music review website. The Aether Atlas is a map of the intangible.
                        In concept, songs which are more similar should be nearer and songs that are far apart should be further from each other.
                        Using a large enough dataset of triplet similarity rankings (e.g. which song is more similar to A? B or C?),
                        we are able to converge on a geometric space that preserves these orderings, effectively allowing us to map out "psychological space".
                        This is a common practice in the cognitive sciences, and I was recently exposed to it as a part of my lab group.
                        I won't go too deep into methodology, because frankly, I am but a wee undergrad who doesn't know much about it.
                        If you want some more technical detail, visit the{' '}
                        <a
                            href="https://github.com/DrakesonHu/aether-atlas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-terracotta hover:text-charcoal transition-colors underline"
                        >
                            GitHub repo
                        </a>.
                        Thanks for visiting!
                    </p>
                </div>
                <div className="mt-12 pt-12 border-t border-warm-gray text-xs text-slate-600 font-display uppercase tracking-widest">
                    © {new Date().getFullYear()} Aether Atlas. All rights reserved.
                </div>
            </div>
        </>
    );
}
