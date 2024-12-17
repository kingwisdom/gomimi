
const About = () => {
    return (
        <div className="container mx-auto p-5">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-bold">Contact Us</h2>
                <h2 className="text-3xl font-bold">PRODUCTDRIVE</h2>
            </header>
            <main>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Other Ways to Reach Us</h2>
                    <p>Adeoye: <a href="mailto:adeoyetemitayo99@gmail.com" className="text-blue-500">adeoyetemitayo99@gmail.com</a></p>
                    <p>Afe: <a href="mailto:afeexclusive@gmail.com" className="text-blue-500">afeexclusive@gmail.com</a></p>
                    <p>LinkedIn: <a href="https://www.linkedin.com/company/81312122/admin/feed/following/" className="text-blue-500">ProductDrive</a></p>
                </section>
            </main>
            <footer className="text-center mt-10">
                <p>&copy; 2022 - {new Date().getFullYear()} ProductDrive. All rights reserved</p>
            </footer>
        </div>
    );
};

export default About;
