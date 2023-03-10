import { JestConfigWithTsJest } from 'ts-jest'
import { defaults as tsjPreset } from 'ts-jest/presets'

const jestConfig: JestConfigWithTsJest = {
  transform: {
      "\\.[jt]sx?$": "babel-jest",
  },
  preset: '@shelf/jest-mongodb',
  rootDir: 'src',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}

export default jestConfig
