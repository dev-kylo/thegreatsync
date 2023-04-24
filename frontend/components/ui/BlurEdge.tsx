

const BlurEdge = ({position}: {position: 'left' | 'right' }) => (
    <div className={`fixed ${position === 'left' ? 'left-[3em]' : 'right-[3em]'} w-12 h-full bg-[#021e44bc] top-0 blur-sm scale-y-150 z-[100]`}></div>
)

export default BlurEdge;