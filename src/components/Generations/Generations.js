import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import './Generations.css'



const Generations = ({getGenerations, resetGame}) => {

    
    
    const MySwal = withReactContent(Swal);
    const generationsContainer = document.getElementsByClassName("generation-container")[0]
        
    
    
    const [currentGenerations, setCurrentGenerations] = useState([true,true,true,true,true,true,true,true])

    const toggleGeneration = (index) => {

        const trueCount = currentGenerations.filter((value) => value === true).length;

        if (trueCount === 1 && currentGenerations[index]) {
            toast.error(`Se necesita por lo menos 1 generación disponible`, {
                autoClose: 3000,
                position: "top-right",
            });
            return;
        }
        
        
        let newGenerations = currentGenerations.slice()
        newGenerations[index] = !newGenerations[index]
        setCurrentGenerations(newGenerations)
    }

    useEffect(() => {
        const handleKeyPress = (event) => {
          const key = event.key;
    
          if(key==='g'){
            if(!generationsContainer.classList.contains("invisible")){
                resetGame()
            }
            toggleGenerationPanel()
          }
          
        };
    
        document.addEventListener('keydown', handleKeyPress);
    
        return () => {
          document.removeEventListener('keydown', handleKeyPress);
        };
    }, [generationsContainer]);

    useEffect(() => {
        getGenerations(currentGenerations);
    }, [currentGenerations]);

    
    const toggleGenerationPanel = async () => {


        if (!generationsContainer.classList.contains("invisible")) {
            generationsContainer.classList.toggle("invisible");
            return;
          }

        let result = await MySwal.fire({
            title: '¿Querés cambiar las generaciones disponibles?',
            text: 'Esto reiniciará tu partida',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Cambiar'
          });

          if(result.isConfirmed){
              generationsContainer.classList.toggle("invisible")
              resetGame(false)
          }

    }

    return(
        <div>
            <div className="generation-selector-button-container">
                <button className="generation-selector-button" onClick={toggleGenerationPanel}>Cambiar <span className="hotkey">G</span>eneración</button>
            </div>

            <div className="generation-container invisible">
                <div  className="generation-selector-panel">
                    {currentGenerations.map((element, index) => (
                        <div key={index} className={`generation-panel ${element===true ? "enabled-panel" : "disabled-panel"}`} onClick={() => toggleGeneration(index)}><span>{index+1}° Gen<span className="shorten-text">eración</span></span></div>
                    ))}

                </div>

                <button className="generation-selector-panel-button" onClick={() => {toggleGenerationPanel(); resetGame(false)}}>Listo</button>

            </div>

        <ToastContainer/>
        </div>
    )
}

export default Generations