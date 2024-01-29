import { Toaster, toast } from 'sonner'


const TypesChallenge = () => {

    const toastMessage = () => toast('My cancel toast', {
        cancel: {
          label: 'Cancel',
          onClick: () => console.log('Cancel!'),
        },
      });

    return (
        <div className='mt-20'>
            <Toaster />
            <button onClick={() => toastMessage()}>
                Give me a toast
            </button>

        </div>
    )
}

export default TypesChallenge