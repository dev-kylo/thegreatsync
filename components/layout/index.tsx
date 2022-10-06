
export default ({ children }: { children: React.ReactNode }) => (
    <main style={{ background: 'linear-gradient(38.92deg, #03143F 10.77%, #008579 115.98%)' }}>
        <div className="relative w-full h-screen  grid grid-cols-1 grid-rows-[10vh,80vh,10vh] overflow-hidden">
            {children}
        </div>
    </main>
)