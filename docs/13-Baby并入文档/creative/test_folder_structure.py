import os
import pytest

def test_folder_structure():
    expected_files = [
        'pytest.ini',
        'test_lmy_yy.py',
        'conftest.py'
    ]
    
    for file in expected_files:
        assert os.path.isfile(file), f"文件缺失: {file}"

    assert os.path.isdir('test_folder_structure.py'), "目录缺失: test_folder_structure.py"