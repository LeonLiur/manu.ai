# tool to cleanup working directory & backend storage

import os, shutil

def cleanup():
    shutil.rmtree("backend/storage")
    
cleanup()