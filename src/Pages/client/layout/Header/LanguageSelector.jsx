

const LanguageSelector = () => (
    <li className="language hidden-xs hidden-sm">
      <span>
        <a className="trans" href="?locale=vi-vn">
          <img src="/img/vn.png" style={{ width: '30px', paddingRight: '5px', borderRight: '1px solid' }} alt="VN" />
        </a>
        <a className="trans" href="?locale=en-us" style={{ paddingRight: '10px' }}>
          <img src="/img/eng.png" style={{ width: '26px', paddingLeft: '5px' }} alt="EN" />
        </a>
      </span>
    </li>
  );

export default LanguageSelector;