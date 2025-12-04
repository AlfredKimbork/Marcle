
export const modeToggle = () => {
    const switchModeBtn = document.querySelector("#mode-btn") as HTMLButtonElement;
    let currentMode = document.body.classList;

    if(localStorage.getItem("dark-mode")) {
        switchModeBtn.innerHTML = `
            <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" class="no-fill" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
            currentMode.add("dark-mode")
    }

    switchModeBtn.addEventListener("click", () => {

        switchModeBtn.classList.add("check");
            setTimeout(() => {
                switchModeBtn.classList.remove("check");
            }, 500)
        if (currentMode.contains("dark-mode")) {
            switchModeBtn.innerHTML = `
            <svg width="32px" height="32px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <g id="Lager_94" data-name="Lager 94" transform="translate(0)">
                    <path id="Path_70" data-name="Path 70" d="M12.516,4.509A12,12,0,0,0,22.3,19.881,12.317,12.317,0,0,0,24,20a11.984,11.984,0,0,0,3.49-.514,12.1,12.1,0,0,1-9.963,8.421A12.679,12.679,0,0,1,16,28,12,12,0,0,1,12.516,4.509M16,0a16.5,16.5,0,0,0-2.212.15A16,16,0,0,0,16,32a16.526,16.526,0,0,0,2.01-.123A16.04,16.04,0,0,0,31.85,18.212,16.516,16.516,0,0,0,32,15.944,1.957,1.957,0,0,0,30,14a2.046,2.046,0,0,0-1.23.413A7.942,7.942,0,0,1,24,16a8.35,8.35,0,0,1-1.15-.08,7.995,7.995,0,0,1-5.264-12.7A2.064,2.064,0,0,0,16.056,0Z" fill="#1f1f1f"/>
                </g>
            </svg>
            `
            currentMode.remove("dark-mode");

            localStorage.removeItem("dark-mode")
        } else {
            switchModeBtn.innerHTML = `
            <svg width="48px" height="48px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" class="no-fill" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            `
            currentMode.add("dark-mode")

            localStorage.setItem("dark-mode", "true")
        }
    })
}