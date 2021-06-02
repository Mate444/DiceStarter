/* eslint-disable max-len */
import React, {useState} from 'react';
import wololo from '../../../img/wololo.mp3';
import './rules.css';

const Rules = () => {
  const [toggle, setToggle] = useState(false);
  const handleClick = () => setToggle(!toggle);
  return (
    <div className='RulesAll'>
      <div className='RulesText'>
        Please follow our rules so we can ensure the best experience for you
        and all of our clients.
        Fortunately, there is only one, which
        <button className='RulesButton' onClick={handleClick}>
            is...
        </button>
        {
          toggle === true &&
          <div className='RulesEasterEgg'>
            <img className='RulesImage' src='data:image/jpeg;base64,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'/>
            <audio className='RulesAudio' controls autoPlay>
              <source src={wololo}/>
            </audio>
            <p className='RulesEasterEggText'>DO NOT SPAM MONKS PLEASE</p>
          </div>
        }
      </div>
    </div>
  );
};

export default Rules;
