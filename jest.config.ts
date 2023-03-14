import { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  transform: {
    '\\.[jt]sx?$': 'babel-jest'
  },
  preset: '@shelf/jest-mongodb',
  rootDir: 'src',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  }
}

export default jestConfig
