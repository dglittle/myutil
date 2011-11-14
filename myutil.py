
import time
import hashlib
import random
import string

def myShuffle(a):
    random.shuffle(a)
    return a

def error(msg):
    raise BaseException(msg)

def randomIdentifier(n=20):
    first_chars = '_' + string.ascii_lowercase + string.ascii_uppercase
    next_chars = first_chars + string.digits
    return ''.join([random.choice(first_chars)] + [random.choice(next_chars) for i in range(n - 1)]) 

def myIndex(a, v):
    try:
        return a.index(v)
    except ValueError:
        return -1

def myRemove(a, v):
    try:
        a.remove(v)
    except ValueError:
        pass

def setAppend(a, v):
    if myIndex(a, v) < 0:
        a.append(v)

def mytime():
    return int(time.time() * 1000)

def sha1(s):
    return hashlib.sha1(s).hexdigest()

