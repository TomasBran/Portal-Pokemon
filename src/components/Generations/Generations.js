import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import './Generations.css'



const Generations = ({getGenerations, resetGame}) => {

    
    
    const MySwal = withReactContent(Swal);
    const [showGenerationsContainer, setShowGenerationsContainer] = useState(false)

        
    
    
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
        getGenerations(currentGenerations);
    }, [currentGenerations]);

    
    const toggleGenerationPanel = async () => {


        if (showGenerationsContainer) {
            setShowGenerationsContainer(prev => !prev);
            resetGame(false)
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
            setShowGenerationsContainer(prev => !prev);
            resetGame(false)
          }

    } 

    return(
        <div>
            <div className="w-full">
                <button className="w-full" onClick={toggleGenerationPanel}>Cambiar Generación</button>
            </div>

            <div className={`p-4 w-[36vw] fixed right-2 bottom-2 bg-white rounded-lg border-2 border-gray-600 flex flex-col gap-6 items-center ${!showGenerationsContainer && 'hidden'}`}>
                <div  className="flex flex-wrap gap-6 justify-center">
                    {currentGenerations.map((element, index) => (
                        <div key={index} className={`w-3/12 py-2 rounded-lg cursor-pointer ${element===true ? "bg-green-400 hover:bg-green-500 active:bg-green-600" : "bg-red-400 hover:bg-red-500 active:bg-red-600"}`} onClick={() => toggleGeneration(index)}><span>{index+1}° Generación</span></div>
                    ))}

                </div>

                <button className="py-3 rounded-lg bg-gray-300 w-2/6 hover:bg-gray-400 active:bg-gray-500" onClick={() => {toggleGenerationPanel(); resetGame(false)}}>Listo</button>

            </div>

        </div>
    )
}

export default Generations