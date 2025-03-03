const BlurEdge = ({ position }: { position: 'left' | 'right' }) => (
    <div
        className={`fixed ${
            position === 'left' ? 'left-[3em]' : 'right-[3em]'
        } w-7 h-6 bg-[red] opacity-50 top-2 blur-sm scale-y-150 z-[100] md:w-12`}
    />
);

export default BlurEdge;
