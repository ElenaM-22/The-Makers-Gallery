const getMakers = async() => {
    const src = "makers.json";

    try{
        const response = await fetch(src);
        return response .json();
    }catch(error){
        console.log("issue");
    }

};

const showMakers = async() =>{
    const makers = await getMakers();
    const makersSection = document.getElementById("makers");

    makers.forEach((maker) => {
        const section = document.createElement("section");
        makersSection.append(section);
        section.classList.add("maker");

        //title link
        const h3 = document.createElement("h3");
        section.append(h3);
        h3.innerHTML = maker.name;
        const h4 = document.createElement("h4");
        section.append(h4);
        h4.innerHTML = maker.major;

        const h5 = document.createElement("h5");
        section.append(h5);
        h5.innerHTML = maker.discipline;

        const p = document.createElement("p");
        section.append(p);
        const a = document.createElement("a");
        p.append(a);
        a.innerHTML = "Projects";
        a.href = maker.portfolio;
        
        const img = document.createElemetn("img");
        section.append(img);
        img.src = `makers.json/json/${maker.headshotLink}`;

        makersSection.append(section);
    });
};

showMakers();